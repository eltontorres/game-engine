class Geometry {
    static distance(p1, p2) {
        return Math.sqrt((p1.posX - p2.posX) ** 2 + (p1.posY - p2.posY) ** 2)
    }

    static sumMinkowski(a = [], b = []) {
        let result = [];
        function sumPoint(p1, p2) {
            return [p1[0] + p2[0], p1[1] + p2[1]]
        }
        for (const i in a) {

            for (const j in b) {
                result.push(sumPoint(a[i], b[j]));
            }
        }
        return result;
    }
}